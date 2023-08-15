export const firstUpperCase = (name: string) => {
  return name
    .split(" ")
    .map((char) => char[0].toUpperCase() + char.slice(1))
    .join(" ");
};

export const getRandomNumberBetween = (start: number, end: number) => {
  return Math.floor(Math.random() * (end - start) + start);
};
