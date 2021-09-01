module.exports = (cookieString) => {
  const attributes = cookieString.split(";").map((attr) => attr.trim());
  const firstAttribute = attributes[0];

  return [
    firstAttribute.substring(0, firstAttribute.indexOf("=")),
    firstAttribute.substring(firstAttribute.indexOf("=") + 1),
  ];
};
