import styles from './Body.module.css';

function Body({posts}){

    return(

        <div className={styles.container}>
            {posts.map((post) => (
                <div key={post.id} className={styles.card}>

                    <img src={post.imageUrl} alt="..." className="card-img-top" />

                    <div className="card-body">
                        <p className={styles.text}>{post.text}</p>
                    </div>

                    <div className="card-footer">
                        <span className={styles.post}>{post.time}</span>
                    </div>

                </div>
            ))}
        </div>
    );

}

export default Body;