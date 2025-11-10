export const questionSetStart = [
  {
    question: "React is a _________.",
    answers: [
      "Web development Framework",
      "JavaScript Library",
      "jQuery",
      "Web Server",
    ],
    correctAnswerIndex: 1,
  },
  {
    question: "Which ReactJS function renders HTML to the web page?",
    answers: [
      "render()",
      "ReactDOM.render()",
      "renders()",
      "ReactDOM.renders()",
    ],
    correctAnswerIndex: 1,
  },
  {
    question: "What is the default behavior of React on state update?",
    answers: [
      "It fully reloads the page",
      "It re-renders the entire DOM",
      "It re-renders only the affected components",
      "It sends a request to the backend",
    ],
    correctAnswerIndex: 2,
  },

  {
    question: "What is JSX in React?",
    answers: [
      "A templating engine",
      "A JavaScript extension that allows HTML-like syntax",
      "A CSS preprocessor",
      "A database query language",
    ],
    correctAnswerIndex: 1,
  },
  {
    question: "What are Props?",
    answers: [
      "Props are arguments passed into React components",
      "Props are functions in the ReactJS",
      "Props are used to return multiple values from a component",
      "All of the above",
    ],
    correctAnswerIndex: 0,
  },
  {
    question: "Which method is used to generate lists?",
    answers: ["map()", "generate()", "new()", "maps()"],
    correctAnswerIndex: 0,
  },
];

export const questionSetOne = [
  {
    question: "What is the main purpose of React's Context API?",
    answers: [
      "To manage routing in a React application",
      "To handle HTTP requests",
      "To share global data without prop drilling",
      "To manage component lifecycle",
    ],
    correctAnswerIndex: 2,
  },
  {
    question: "Which two parts make up the Context API?",
    answers: [
      "Provider and Consumer",
      "Reducer and Dispatcher",
      "Hook and Callback",
      "State and Props",
    ],
    correctAnswerIndex: 0,
  },
  {
    question: "Where should you place the Context Provider in your app?",
    answers: [
      "Outside the React app root",
      "As deep as possible in the component tree",
      "At any random location",
      "High up in the component tree to wrap components that need access",
    ],
    correctAnswerIndex: 3,
  },
  {
    question: "What are React Server Components designed to do?",
    answers: [
      "Handle client-side state more efficiently",
      "Replace all server-side logic",
      "Render components on the server and send serialized HTML/JS to the client",
      "Enable browser-only rendering",
    ],
    correctAnswerIndex: 2,
  },
  {
    question: "Which of the following is true about Server Components?",
    answers: [
      "They can use browser-only APIs like window or document",
      "They can fetch data directly from the server",
      "They replace the need for React Context",
      "They must be rendered inside useEffect",
    ],
    correctAnswerIndex: 1,
  },
  {
    question:
      "What file extension is commonly used for React Server Components?",
    answers: [".jsx", ".js", ".server.js", ".component.js"],
    correctAnswerIndex: 2,
  },
];

export const questionSetTwo = [
  {
    question: "What types of components do we have in ReactJS?",
    answers: [
      "Variable and Const components",
      "Class and Function components",
      "Method and Function components",
      "Array and Object components",
    ],
    correctAnswerIndex: 1,
  },
  {
    question: "Which statement is required to define a class component?",
    answers: [
      "extends React.Components",
      "imports React.Components",
      "extends React.Component",
      "imports React.Component",
    ],
    correctAnswerIndex: 2,
  },
  {
    question: "Can components be passed as props?",
    answers: ["Yes", "No", "Maybe"],
    correctAnswerIndex: 0,
  },
  {
    question: "What is React.Fragment used for?",
    answers: [
      "To create new DOM elements",
      "To group multiple elements without adding extra nodes to the DOM",
      "To add inline styles",
      "To memoize components",
    ],
    correctAnswerIndex: 1,
  },
  {
    question: "How many top-level elements can a valid React component return?",
    answers: [
      "1 Element",
      "More than 1 element",
      "React does not return element",
      "None of the mentioned",
    ],
    correctAnswerIndex: 0,
  },
  {
    question: "Which of the following methods is not a part of ReactDOM?",
    answers: [
      "ReactDOM.hydrate()",
      "ReactDOM.destroy()",
      "ReactDOM.createPortal()",
      "All of the mentioned",
    ],
    correctAnswerIndex: 1,
  },
];

export const questionSetThree = [
  {
    question:
      "What of the following is used in React.js to increase performance?",
    answers: [
      "Original DOM",
      "Virtual DOM",
      "Both A and B.",
      "None of the above.",
    ],
    correctAnswerIndex: 1,
  },
  {
    question:
      "Which of the following keywords are used to create a class inheritance?",
    answers: ["Create", "Inherits", "Extends", "This"],
    correctAnswerIndex: 2,
  },
  {
    question:
      "What is the declarative way to render a dynamic list of components based on values in an array?",
    answers: [
      "Using the reduce array method",
      "Using the <Each /> component",
      "Using the Array.map() method",
      "With a for/while loop",
    ],
    correctAnswerIndex: 2,
  },
  {
    question: "What are the two ways to handle data in React?",
    answers: [
      "State & Props",
      "Services & Components",
      "State & Services",
      "State & Component",
    ],
    correctAnswerIndex: 0,
  },
  {
    question: "Does React.js create a VIRTUAL DOM in the memory?",
    answers: ["Yes", "No", "Maybe"],
    correctAnswerIndex: 0,
  },
  {
    question: "What is Reconciliation?",
    answers: [
      "The process through which React deletes the DOM",
      "The process through which React updates and deletes the component",
      "It is a process to set the state",
      "The process through which React updates the DOM",
    ],
    correctAnswerIndex: 3,
  },
];

export const questionSetFour = [
  {
    question: "Who developed React.js?",
    answers: ["Apple", "Facebook", "Twitter", "Google"],
    correctAnswerIndex: 1,
  },
  {
    question:
      "The lifecycle methods of components fall under which categories?",
    answers: [
      "Mounting, Unmounting",
      "Mounting, Updating",
      "Updating, Unmounting",
      "Mounting, Updating, Unmounting",
    ],
    correctAnswerIndex: 3,
  },
  {
    question: "React.js only covers the view layer of an application.",
    answers: ["Yes", "No", "Maybe"],
    correctAnswerIndex: 0,
  },
  {
    question: "What is the DOM?",
    answers: [
      "Document Object Model",
      "Data Object Model",
      "Data Option Model",
      "Documentation Object Model",
    ],
    correctAnswerIndex: 0,
  },
  {
    question: "React components can be?",
    answers: [
      "UseState, Stateless",
      "Statefull, Stateless",
      "Unstatefull Stateful",
      "None of these",
    ],
    correctAnswerIndex: 1,
  },
  {
    question: "Can we write a comment in SVG file?",
    answers: ["Yes", "No", "Maybe"],
    correctAnswerIndex: 0,
  },
];

export const questionSetFive = [
  {
    question: "JSX stands for _____.",
    answers: ["JSON", "JSON XML", "JavaScript XML", "JavaScript and AngularJS"],
    correctAnswerIndex: 2,
  },
  {
    question: "What is a key prop in React used for?",
    answers: [
      "To uniquely identify elements in a list",
      "To encrypt data",
      "To access state",
      "To trigger re-renders",
    ],
    correctAnswerIndex: 0,
  },
  {
    question:
      "Which method is used to pass data from parent to child component?",
    answers: ["Using Redux", "Using props", "Using context", "Using useRef"],
    correctAnswerIndex: 1,
  },
  {
    question:
      "What is the purpose of useEffect with an empty dependency array?",
    answers: [
      "It runs on every render",
      "It never runs",
      "It runs only once after the initial render",
      "It causes a memory leak",
    ],
    correctAnswerIndex: 2,
  },
  {
    question: "How can you optimize performance in a React app?",
    answers: [
      "Using more components",
      "Using class components only",
      "Using useMemo, React.memo, and useCallback",
      "Avoiding functional components",
    ],
    correctAnswerIndex: 2,
  },
  {
    question: "Which statement about React keys is true?",
    answers: [
      "They should be random values",
      "They must be globally unique",
      "They help React identify which items changed",
      "They are optional for lists",
    ],
    correctAnswerIndex: 2,
  },
];

export const questionSetSix = [
  {
    question: "What is the primary purpose of Next.js?",
    answers: [
      "Styling React apps",
      "Providing a backend framework for React",
      "Building server-rendered React applications",
      "Replacing React with a new frontend library",
    ],
    correctAnswerIndex: 2,
  },
  {
    question: "Which folder is used for routing in a Next.js application?",
    answers: ["routes/", "app/", "views/", "components/"],
    correctAnswerIndex: 1,
  },
  {
    question: "How do you create a dynamic route in Next.js?",
    answers: [
      "By using a wildcard in the URL",
      "By using the Router API",
      "By creating a file with square brackets (e.g. [id].js)",
      "By calling dynamic() inside the component",
    ],
    correctAnswerIndex: 2,
  },
  {
    question: "What does getServerSideProps() do in Next.js?",
    answers: [
      "Fetches data only on the client-side",
      "Generates static pages at build time",
      "Fetches data at request time for server-side rendering",
      "Prevents data fetching entirely",
    ],
    correctAnswerIndex: 2,
  },
  {
    question: "What is the default rendering mode in Next.js pages?",
    answers: [
      "Client-side rendering (CSR)",
      "Static Site Generation (SSG)",
      "Server-side rendering (SSR)",
      "Incremental Static Regeneration (ISR)",
    ],
    correctAnswerIndex: 1,
  },
  {
    question: "Which command is used to build a production-ready Next.js app?",
    answers: ["next dev", "next serve", "next start", "next build"],
    correctAnswerIndex: 3,
  },
];
