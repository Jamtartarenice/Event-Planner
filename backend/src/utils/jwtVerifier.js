// jwtVerifier.js
const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');

const jwksUri = 'https://your-auth0-tenant.auth0.com/.well-known/jwks.json'; // Replace with your JWKS endpoint
const audience = 'your-audience'; // Replace with your audience
const issuer = 'https://your-auth0-tenant.auth0.com/'; // Replace with your issuer

const client = jwksClient({
  jwksUri: jwksUri
});

function getKey(header, callback) {
  client.getSigningKey(header.kid, function(err, key) {
    if (err) {
      console.error('Error fetching signing key:', err);
      return callback(err);
    }
    const signingKey = key.publicKey || key.rsaPublicKey;
    callback(null, signingKey);
  });
}

function verifyToken(token, callback) {
  jwt.verify(token, getKey, {
    audience: audience,
    issuer: issuer,
    algorithms: ['RS256']
  }, function(err, decoded) {
    if (err) {
      console.error('Token verification error:', err.message);
      callback(err);
    } else {
      console.log('Token verified successfully:', decoded);
      callback(null, decoded);
    }
  });
}

module.exports = {
  verifyToken: verifyToken
};
