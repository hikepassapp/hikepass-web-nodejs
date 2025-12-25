const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  if (err.code === 'ER_DUP_ENTRY') {
    return res.status(400).json({
      success: false,
      message: 'Data sudah ada'
    });
  }

  if (err.code === 'ER_BAD_FIELD_ERROR') {
    return res.status(400).json({
      success: false,
      message: 'Field tidak valid'
    });
  }

  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Server Error'
  });
};

module.exports = errorHandler;