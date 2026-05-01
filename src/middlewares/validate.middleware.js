const validate = (schema) => (req, res, next) => {
    const options = {
        abortEarly: false, // tampilkan semua error (mirip Laravel)
        allowUnknown: true, // biar field lain tetap lewat
        stripUnknown: true // buang field yang ga ada di schema
    };

    const { error, value } = schema.validate(req.body, options);

    if (error) {
        const errors = {};

        error.details.forEach((err) => {
            const key = err.path[0];
            errors[key] = err.message.replace(/"/g, '');
        });

        return res.status(422).json({
            success: false,
            message: 'Validation error',
            errors
        });
    }

    req.body = value;
    next();
};

module.exports = validate;