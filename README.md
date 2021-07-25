# 얄팍한 코딩사전 GraphQL

<img src="gitImages\Yalco.PNG">

해당 저장소는 얄팍한 코딩사전님의 <a href="https://www.inflearn.com/course/%EC%96%84%ED%8C%8D%ED%95%9C-graphql-apollo/lecture">인프런 강좌</a>를 보고 제작되었음을 미리 밝힙니다.

GraphQL & Apollo 에 대한 학습을 위하여 만들었음

해당 Repository 는 <a href="https://www.yalco.kr/">얄코님의 블로그</a>를 보고 참고되었음

### :sunglasses: GraphQL

어떠한 장점이 있어서 REST_API 보다 GraphQL을 사용할까?? 해당 교육자는 이렇게 말한다

<blockquote cite="https://www.inflearn.com/course/%EC%96%84%ED%8C%8D%ED%95%9C-graphql-apollo/lecture"><i>1 필요한 정보들만 선택하여 가져올 수 있음

2 하나의 전송으로 모든 요청을 처리

3 여러 계층의 정보를 한번에 가져옴 </i></blockquote>

<img src="gitImages\Take_Data.PNG">

즉 자신의 입맛대로 원하는 데이터만을 한번에 가져올 수 있다는 것이다.

### :rocket: Apollo

해당 저장소에서는 Apollo를 활용할 것인데 이를 사용하는 이유는 간단하다.

<img src="gitImages\Why Apollo.jpg">

GraphQL 공식문서에도 나와있는 지원 플렛폼이며, 프론트 & 백엔드 단을 모두 지원하기 때문이며 이를 웹에 표시하는 프레임워크로는 리엑트를 사용한다.

### :mag_right: Query Data

데이터를 조회할 때는 어떻게 해야할까?? 해당 강의는 기본적인 데이터베이스 데이터를 구성하기 쉽게 작업해주기 때문에 우린 쿼리만 쏘면 되는데 GraphQL을 사용해 Apollo서버에 데이터를 요청하는 방법은 아래와 같다.

```javascript
const { gql, ApolloServer } = require("apollo-server");
const database = require("./database");

// gql 태그로 Query 타입 지정
const typeDefs = gql`
  type Query {
    teams: [Team]
  }
  type Team {
    id: Int
    manager: String
    office: String
    extension_number: String
    mascot: String
    cleaning_duty: String
    project: String
  }
`;

// Query명령어에 teams를 요청할 경우 database.teams 데이터를 사용함
const resolvers = {
  Query: {
    teams: () => database.teams,
  },
};

// 위의 타입지정과 resolvers를 인자로 넘겨주고 server.listen()시 서버시작, 인자로 url을 받을 수 있음
const server = new ApolloServer({ typeDefs, resolvers });
server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
```

<img src="gitImages\ReturnDatas.jpg">

출력 결과는 위와같음

### :airplane: 인자있는 쿼리 날리기

특정 정보를 요청하려면 어떠한 처리를 해야할까??

우선 gql함수 내부에 Query 문 안쪽에 어떠한 형식으로 데이터를 부를지 정의해야한다.

예를들어 특정 번호를 가진 사람의 정보를 얻고싶다면

```javascript
gql`
  type Query {
    person(id: number): People
  }
`;

const resolvers = {
  Query: {
    //조건을 줄 수 있으며 args 객체는 인자로 넘겨준 값을 갖고있음
    person: (parent, args, context, info) => args.id === data.id,
  },
};
```

<img src="gitImages\Arg.PNG">

위와같다.

### :fire: Mutation

Mutation은 데이터를 추가, 수정, 삭제 할 때 필요한 질의어이며 이는 간단하게 구현이 가능하다

우선 gql함수 내부에 Query가 아닌 Mutation을 선언한다

```javascript
gql`
  type Mutation {
    del(id: Int): String
  }
`;
```

위와 같은 방법으로 선언이 가능하며, resolvers 에서도 또한

```javascript
const resolvers = {
  Mutation: {
    ItIsDeleteFunc: (parent, args, context, info) =>
      datas.filter((data) => data.id === args.id)[0],
  },
};
```

위와 같은 방법으로 Query와 매우 유사하게 데이터를 관리할 수 있다.

<img src="gitImages\Mutation.PNG">

쿼리와 마찬가지로 Mutation내부에서 함수를 선언할 때 출력값을 설정했다면 중괄호 내부에 조회할 데이터를 넣어 함수작동과 동시에 데이터 조회가 가능하다 ex) 데이터를 추가한 후 해당 데이터 출력

### :package: 모듈화

만약 우리의 쿼리 수 및 적용해야하는 데이터의 수가 많아진다면 index.js는 매우 무겁고 길어지며, 가독성 또한 현저하게 떨어질 것이다. 이를 방지하기 위해 GraphQL은 모듈화를 가능하게 해주는데, 인자를 배열로 넣을 수 있게 개발해놓았다.

<img src="gitImages\Modularize.PNG">

```javascript
// Other JS File
module.exports = { typeDefs, resolvers };

// index.js

// require All typeDefs, resolvers
const typeDefs = [...AllTypeDefs];

const resolvers = [...AllResolvers];

const server = new ApolloServer({ typeDefs, resolvers });
```

위와같이 배열로 전달이 가능하기 때문에 모듈화가 쉽게 가능하다.

### :file_folder: Enum

Enum은 해당 조건이 만족하는 데이터만을 반환하는 조건이며 해당 강의에서는

```javascript
// _enums.js
const typeDefs = gql`
  enum Role {
    developer
    designer
    planner
  }
`;

// equipmets.js
const typeDefs = gql`
  type Equipment {
    ...
    used_by: Role!
    ...
  }
`;
```

위와 같이 사용하는데 used_by는 developer, designer, planner 만이 올 수 있다고 명시하는 것이다.

### :heavy_exclamation_mark: !

!는 MySQL의 Not Null과 같은 역할을 하며 데이터가 Null인 행을 조회하지 않는 것이다.

```javascript
// equipmets.js
const typeDefs = gql`
  type Equipment {
    ...
    used_by: Role!
    ...
  }
`;
```

위의 예제의 조건과 같음 반드시 developer, designer, planner이 온다고 명시하는 것

### :heavy_plus_sign: Union

Union은 하나의 배열에 여러개의 정보를 출력하고 싶을 때 사용된다.

기본적으로 | 로 두 개의 타입을 구분할 수 있게 선언되며 형식은

```javascript
union UnionType = Book | Author
```

위와 같이 선언되며 만약 타입을 UnionType으로 명시한다면 Book과 Author 둘 다 올 수 있음

### :tropical_drink: Interface

interface는 각 타입들이 같은 유형을 중복해서 포함하는 경우에 사용이 용이한데,

```javascript
// tools.js
const typeDefs = gql`
  interface Tool {
    id: ID!
    used_by: Role!
  }
`;

// softwares.js
const typeDefs = gql`
  type Software implements Tool {
    id: ID!
    used_by: Role!
    developed_by: String!
    description: String
  }
`;
```

위와 같이 적용하고싶은 타입 뒤에 implements (InterFaceName) 으로 선언하면 된다.

### :round_pushpin: Args & Input

인자와 Input타입은 어떻게 정의하여 사용해야할까? 이전에도 다룬적이 있지만,

```javascript
// queries.js
const typeDefs = gql`
  type Query {
    peopleFiltered(
      team: Int
      sex: Sex
      blood_type: BloodType
      from: String
    ): [People]
  }
`;
```

<img src="gitImages\Args Type Error.jpg">

위와같이 받을 인자의 이름과 타입을 정의해주면 인자를 넘겨줄 때 해당 타입의 인자밖에 받지 않는다. 이후 기존 타입 적용과 동일하게 반환하는 데이터의 타입또한 선언해주어야함
