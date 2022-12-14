const testArray = [
  {
    name: "Gerald",
    age: 30,
  },
  {
    name: "Gabbie",
    age: 12,
  },
  {
    name: "Kevin",
    age: 23,
  },
  {
    name: "Trizha",
    age: 15,
  },
];

const TestPage = () => {
  const sumOfAges = testArray.reduce((accumulatedValue, curr) => (sum += curr.age), 0);

  return (
    <>
      <h1>Test Page</h1>
      <p className="mt-32">{sumOfAges}</p>
    </>
  );
};

export default TestPage;
