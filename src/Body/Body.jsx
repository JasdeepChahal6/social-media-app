import { useState } from 'react';
import styles from './Body.module.css';
import axios from 'axios';

function Body({posts, isUpdating, setPosts}){
    const [editPostId, setEditPostId] = useState(null);
    const [updateText, setUpdateText] = useState('');

    const handleEdit = (postId, currentText) => {
        setEditPostId(postId);
        setUpdateText(currentText);
    };

    const handleSave = async (postId) => {
        const updatedPosts = posts.map((post) =>
            post.id === postId ? { ...post, post_text: updateText } : post
        );
        setPosts(updatedPosts);

        try {
            await axios.put(`http://localhost:3000/update/${postId}`, { post_text: updateText });
        } catch (error) {
            console.error('Error updating post:', error);
        }

        setEditPostId(null);
        setUpdateText('');
    };

    const handleCancel = () => {
        setEditPostId(null);
        setUpdateText('');
    };


    return (
        <div className={styles.container}>
            {posts.map((post) => (
                <div key={post.id} className={styles.card}>
                    <img src={post.image_url} alt="Post Image" className={styles.cardImgTop} />

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
                                        <button onClick={() => handleSave(post.id)} disabled={!updateText.trim()}>Save</button>
                                        <button onClick={handleCancel}>Cancel</button>
                                    </>
                                ) : (
                                    <button onClick={() => handleEdit(post.id, post.post_text)}>Edit</button>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );

}

export default Body;