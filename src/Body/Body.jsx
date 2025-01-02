import styles from './Body.module.css';

function Body({posts}){

    return(

        <div className={styles.container}>
            {posts.map((post) => (
                <div key={post.id} className={styles.card}>

                    <img src={post.imageUrl || "https://picsum.photos/200/300?random=1"} alt="Post Image" className={styles.cardImgTop} />


                    <div className="card-body">
                        <p className={styles.text}>{post.text}</p>
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