import { ApolloServer, gql } from "apollo-server";
// 같은 뜻 다른방식
// const { ApolloServer, gql } = require("apollo-server");

let tweets = [
  {
    id: "1",
    text: "first",
    userId: "2",
  },
  {
    id: "2",
    text: "second",
    userId: "1",
  },
];

let users = [
  {
    id: "1",
    firstName: "Sung",
    lastName: "YoungHo",
  },
  {
    id: "2",
    firstName: "Elon",
    lastName: "Mask",
  },
];

const typeDefs = gql`
  type User {
    id: ID
    firstName: String!
    lastName: String!
    fullName: String!
  }
  type Tweet {
    id: ID!
    text: String!
    author: User
  }
  type Query {
    allUsers: [User!]!
    allTweets: [Tweet!]!
    tweet(id: ID): Tweet
  }
  type Mutation {
    postTweet(text: String!, userId: ID!): Tweet!
    deleteTweet(id: ID!): Boolean!
  }
`;

const resolvers = {
  Query: {
    allTweets() {
      return tweets;
    },
    tweet(root, { id }) {
      return tweets.find((tweet) => tweet.id === id);
    },
    allUsers() {
      console.log("allUsers called");
      return users;
    },
  },
  Mutation: {
    postTweet(_, { text, userId }) {
      try {
        if (users.find((user) => user.id === userId)) {
          const newTweet = {
            id: tweets.length + 1,
            text,
            userId,
          };
          tweets.push(newTweet);
          return newTweet;
        } else {
          throw new Error("no User there");
        }
      } catch (error) {
        console.log(error);
      }
    },
    deleteTweet(_, { id }) {
      const tweet = tweets.find((tweet) => tweet.id === id);
      if (!tweet) return false;
      tweets = tweets.filter((tweet) => tweet.id !== id);
      return true;
    },
  },
  User: {
    firstName({ firstName }) {
      return firstName;
    },
    fullName({ firstName, lastName }) {
      return `${firstName} ${lastName}`;
    },
  },
  Tweet: {
    author({ userId }) {
      return users.find((user) => user.id === userId);
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`Running on ${url}`);
});

//----------------------

// Lists and Non-Null

// 아래 Character에 name에 String 타입을 사용하고 느낌표 !를 추가하여 Non-Null로 표시합니다.
// Non-Null로 표시하게 되면 서버가 항상 이 필드에 대해 null이 아닌 값을 반환할 것으로 예상합니다. 그래서 null 값을 얻게 되면 클라이언트에게 문제가 있음을 알립니다.
// ```
// type Character {
//  name: String!
//  appearsIn: [Episode]!
// }
// ```

//-----------------
// Recap

// - 아폴로 서버를 실행하기 위해서는 반드시 최소 1개의 Query가 필요합니다.
// - type Query는 가장 기본적인 타입입니다.
// - Query에 넣는 필드들은 request할 수 있는 것들이 됩니다.
// - !를 쓰지 않으면 해당 필드는 nullable field가 됩니다. (null값을 가질 수 있는 필드)

//-------------------
// Resolvers

// resolver 함수는 데이터베이스에 액세스한 다음 데이터를 반환합니다.
// ```
// // args는 GraphQL 쿼리의 필드에 제공된 인수입니다.
// Query: {
//  human(obj, args, context, info) {
//    return context.db.loadHumanByID(args.id).then(
//      userData => new Human(userData)
//      )
//   }
// }
// ```
