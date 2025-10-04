#!/usr/bin/env python3
"""Monitoring script for FounderCRM deployment."""
import os
import sys
import time
import requests
import psutil
import docker
from datetime import datetime
from typing import Dict, Any

# Configuration
API_URL = os.getenv("API_URL", "http://localhost:8000")
DOCKER_COMPOSE_FILE = "docker-compose.prod.yml"
ALERT_THRESHOLD = {
    "cpu_percent": 80.0,
    "memory_percent": 80.0,
    "disk_percent": 85.0,
    "response_time": 2.0  # seconds
}

def check_system_resources() -> Dict[str, Any]:
    """Check system CPU, memory, and disk usage."""
    return {
        "cpu_percent": psutil.cpu_percent(interval=1),
        "memory_percent": psutil.virtual_memory().percent,
        "disk_percent": psutil.disk_usage('/').percent,
        "timestamp": datetime.now().isoformat()
    }

def check_api_health() -> Dict[str, Any]:
    """Check API health and response time."""
    try:
        start_time = time.time()
        response = requests.get(f"{API_URL}/health")
        response_time = time.time() - start_time
        
        return {
            "status": response.status_code,
            "response_time": response_time,
            "healthy": response.status_code == 200,
            "timestamp": datetime.now().isoformat()
        }
    except requests.exceptions.RequestException as e:
        return {
            "status": "error",
            "error": str(e),
            "healthy": False,
            "timestamp": datetime.now().isoformat()
        }

def check_docker_containers() -> Dict[str, Any]:
    """Check status of Docker containers."""
    client = docker.from_env()
    containers = {}
    
    for container in client.containers.list():
        containers[container.name] = {
            "status": container.status,
            "health": container.attrs['State'].get('Health', {}).get('Status'),
            "restarts": container.attrs['RestartCount'],
            "created": container.attrs['Created']
        }
    
    return containers

def check_database() -> Dict[str, Any]:
    """Check database connectivity and status."""
    try:
        response = requests.get(f"{API_URL}/api/health/db")
        return {
            "status": "healthy" if response.status_code == 200 else "unhealthy",
            "details": response.json(),
            "timestamp": datetime.now().isoformat()
        }
    except requests.exceptions.RequestException as e:
        return {
            "status": "error",
            "error": str(e),
            "timestamp": datetime.now().isoformat()
        }

def alert(message: str) -> None:
    """Send alert (implement your preferred alerting mechanism)."""
    print(f"ALERT: {message}")
    # TODO: Implement actual alerting (email, Slack, etc.)

def main():
    """Main monitoring loop."""
    while True:
        try:
            # Check system resources
            resources = check_system_resources()
            if resources["cpu_percent"] > ALERT_THRESHOLD["cpu_percent"]:
                alert(f"High CPU usage: {resources['cpu_percent']}%")
            if resources["memory_percent"] > ALERT_THRESHOLD["memory_percent"]:
                alert(f"High memory usage: {resources['memory_percent']}%")
            if resources["disk_percent"] > ALERT_THRESHOLD["disk_percent"]:
                alert(f"High disk usage: {resources['disk_percent']}%")

            # Check API health
            api_health = check_api_health()
            if not api_health["healthy"]:
                alert(f"API unhealthy: {api_health}")
            elif api_health.get("response_time", 0) > ALERT_THRESHOLD["response_time"]:
                alert(f"Slow API response: {api_health['response_time']}s")

            # Check Docker containers
            containers = check_docker_containers()
            for name, info in containers.items():
                if info["status"] != "running" or info.get("health") not in ["healthy", None]:
                    alert(f"Container {name} issue: {info}")

            # Check database
            db_status = check_database()
            if db_status["status"] != "healthy":
                alert(f"Database issue: {db_status}")

            # Log status
            print(f"[{datetime.now().isoformat()}] Status:")
            print(f"System: {resources}")
            print(f"API: {api_health}")
            print(f"Containers: {containers}")
            print(f"Database: {db_status}")
            print("-" * 80)

            # Wait before next check
            time.sleep(60)

        except KeyboardInterrupt:
            print("\nMonitoring stopped by user")
            sys.exit(0)
        except Exception as e:
            print(f"Error in monitoring: {e}")
            time.sleep(60)

if __name__ == "__main__":
    main()