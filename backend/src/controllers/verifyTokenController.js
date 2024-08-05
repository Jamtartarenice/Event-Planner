const jwt = require('jsonwebtoken');

exports.verifyToken = (req, res) => {
  const token = req.body.token;
  if (!token) {
    return res.status(400).json({ error: 'No token provided' });
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      console.error('Token verification error:', err);
      return res.status(401).json({ error: 'Token is not valid' });
    }
    const newAccessToken = jwt.sign({ sub: decoded.sub, email: decoded.email, role: decoded.role }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
    res.json({ accessToken: newAccessToken, role: decoded.role });
  });
};
