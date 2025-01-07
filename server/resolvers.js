export const resolvers = {
  Query: {
    greeting: () => "Hello world!",
    jobs: () => {
      return [
        {
          id: "test-id-1",
          title: "Software Engineer",
          description: "Develop software projects with professionalism.",
        },
        {
          id: "test-id-2",
          title: "Software Engineer",
          description: "Develop software projects with professionalism.",
        },
      ];
    },
  },
};
