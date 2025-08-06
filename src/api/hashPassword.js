import bcrypt from "bcrypt";

export const encryptPassword = (password) => {
  const saltRound = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, saltRound);
  return hash;
};

export const comparePassword = (password, passwordFromDB) => {
  return bcrypt.compareSync(password, passwordFromDB);
};
