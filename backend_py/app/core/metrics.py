"""Prometheus metrics configuration."""
from prometheus_client import Counter, Histogram, Gauge
from fastapi import FastAPI
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
import time

# Metrics
REQUEST_COUNT = Counter(
    'http_request_count',
    'HTTP Request Count',
    ['method', 'endpoint', 'http_status']
)

REQUEST_LATENCY = Histogram(
    'http_request_latency_seconds',
    'HTTP Request Latency',
    ['method', 'endpoint']
)

REQUESTS_IN_PROGRESS = Gauge(
    'http_requests_in_progress',
    'HTTP Requests In Progress',
    ['method', 'endpoint']
)

DB_CONNECTION_POOL = Gauge(
    'db_connection_pool',
    'Database Connection Pool Statistics',
    ['state']  # idle, used, total
)

FAILED_LOGIN_ATTEMPTS = Counter(
    'failed_login_attempts',
    'Number of Failed Login Attempts',
    ['ip_address']
)

API_ERROR_COUNT = Counter(
    'api_error_count',
    'Number of API Errors',
    ['endpoint', 'error_type']
)

class PrometheusMiddleware(BaseHTTPMiddleware):
    """Middleware to collect Prometheus metrics."""
    
    async def dispatch(self, request: Request, call_next):
        """Process the request and collect metrics."""
        method = request.method
        path = request.url.path
        
        # Track requests in progress
        REQUESTS_IN_PROGRESS.labels(method=method, endpoint=path).inc()
        
        # Track request latency
        start_time = time.time()
        
        try:
            response = await call_next(request)
            
            # Update request count
            REQUEST_COUNT.labels(
                method=method,
                endpoint=path,
                http_status=response.status_code
            ).inc()
            
            return response
            
        except Exception as exc:
            # Track API errors
            API_ERROR_COUNT.labels(
                endpoint=path,
                error_type=type(exc).__name__
            ).inc()
            raise
            
        finally:
            # Update request latency
            resp_time = time.time() - start_time
            REQUEST_LATENCY.labels(
                method=method,
                endpoint=path
            ).observe(resp_time)
            
            # Decrease in-progress counter
            REQUESTS_IN_PROGRESS.labels(method=method, endpoint=path).dec()

def init_metrics(app: FastAPI) -> None:
    """Initialize Prometheus metrics middleware."""
    app.add_middleware(PrometheusMiddleware)
    
    # Initial values for DB pool metrics
    DB_CONNECTION_POOL.labels(state='idle').set(0)
    DB_CONNECTION_POOL.labels(state='used').set(0)
    DB_CONNECTION_POOL.labels(state='total').set(0)