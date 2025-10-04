const transformDates = (obj) => {
  if (!obj || typeof obj !== 'object') return obj;

  const transformed = Array.isArray(obj) ? [...obj] : { ...obj };
  const dateFields = [
    'createdAt',
    'updatedAt',
    'dueDate',
    'startDate',
    'endDate',
    'joinDate',
    'lastActive'
  ];

  Object.entries(transformed).forEach(([key, value]) => {
    if (dateFields.includes(key) && typeof value === 'string') {
      transformed[key] = new Date(value);
    } else if (typeof value === 'object') {
      transformed[key] = transformDates(value);
    }
  });

  return transformed;
};

export const requestTransform = {
  dates: (data) => {
    const transformed = { ...data };
    Object.keys(transformed).forEach(key => {
      if (transformed[key] instanceof Date) {
        transformed[key] = transformed[key].toISOString();
      }
    });
    return transformed;
  }
};

export const responseTransform = {
  dates: transformDates
};