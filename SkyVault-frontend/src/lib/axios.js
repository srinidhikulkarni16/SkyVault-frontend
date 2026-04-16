import axios from "axios";
import { useEffect, useState } from "react";

function App() {

  const [posts, setPosts] = useState([]);

  useEffect(() => {

    axios.get("https://jsonplaceholder.typicode.com/posts")
      .then(res => {
        setPosts(res.data);
      });

  }, []);

  return (
    <div>
      {posts.map(post => (
        <p key={post.id}>{post.title}</p>
      ))}
    </div>
  );
}

export default App;