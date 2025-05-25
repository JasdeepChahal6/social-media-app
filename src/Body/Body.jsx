import { useState } from "react";
import styles from "./Body.module.css";

function Body({
  posts,
  isUpdating,
  setPosts,
  isDeleting,
  deletePosts,
  editPost,
}) {
  const [editPostId, setEditPostId] = useState(null);
  const [updateText, setUpdateText] = useState("");

  const handleEdit = (postId, currentText) => {
    setEditPostId(postId);
    setUpdateText(currentText);
  };

  const handleSave = async (postId) => {
    try {
      await editPost(postId, updateText); 
      setEditPostId(null);
      setUpdateText("");
    } catch (error) {
      console.error("Error saving post:", error);
    }
  };

  const handleCancel = () => {
    setEditPostId(null);
    setUpdateText("");
  };

  return (
    <div className={styles.container}>
      {posts.map((post) => (
        <div key={post.id} className={styles.card}>
          <img
            src={post.image_url}
            alt="Post Image"
            className={styles.cardImgTop}
          />

          <div className="card-body">
            {editPostId === post.id ? (
              <textarea
                className={styles.textarea}
                value={updateText}
                onChange={(e) => setUpdateText(e.target.value)}
              />
            ) : (
              <p className={styles.text}>{post.post_text}</p>
            )}
          </div>

          <div className="card-footer">
            <span className={styles.time}>{post.time}</span>

            {isUpdating && (
              <div>
                {editPostId === post.id ? (
                  <>
                    <button
                      onClick={() => handleSave(post.id)}
                      disabled={!updateText.trim()}
                    >
                      Save
                    </button>
                    <button onClick={handleCancel}>Cancel</button>
                  </>
                ) : (
                  <button onClick={() => handleEdit(post.id, post.post_text)}>
                    Edit
                  </button>
                )}
              </div>
            )}

            {isDeleting && (
              <div>
                <button onClick={() => deletePosts(post.id)}>Delete</button>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default Body;
