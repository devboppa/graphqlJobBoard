export const resolvers = {
  Query: {
    greeting: () => "Hello world!",
    job: () => {
      return {
        id: "jhb",
        title: "Software Engineer",
        description: "Develop software projects with professionalism.",
      };
    },
  },
};
