// @flow

type Customer = {
  id: number,
  name: string
};

const helloWorld = "Hello World";
const numberOver = 9000;
const bears = false;

const getCustomer = (id: number, name: string, msg): Customer => {
  console.log(msg);
  return { id, name };
};

const customer = getCustomer(1, "Alice", "Untyped Param");
