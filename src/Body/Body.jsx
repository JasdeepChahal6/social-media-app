import styles from './Body.module.css';

function Body({posts}){

    return(

        <div className={styles.container}>
            {posts.map((post) => (
                <div key={post.id} className={styles.card}>

                    <img src={post.image_url} alt="Post Image" className={styles.cardImgTop} />


                    <div className="card-body">
                        <p className={styles.text}>{post.post_text}</p>
                    </div>

                    <div className="card-footer">
                        <span className={styles.time}>{post.time}</span>
                    </div>

                </div>
            ))}
        </div>
    );

}

export default Body;