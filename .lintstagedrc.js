module.exports = {
  "*.js|*.vue|*.ts": (filenames) => {
    if (filenames.length > 50) {
      return [
        "yarn lint",
        "git add ."
      ];
    } else {
      return [
        `eslint --ext .js,.ts,.vue --fix ${filenames.join(" ")}`,
        `git add ${filenames.join(' ')}`
        ];
    }
  },
};
