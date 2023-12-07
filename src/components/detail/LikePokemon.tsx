import { useEffect, useState } from 'react';
import styles from './Detail.module.scss';
import { FaRegHeart } from 'react-icons/fa';
import { FaHeart } from 'react-icons/fa';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import useUserStore from '@/store/useUsersStore';
import { db } from '@/firebase';

interface LikePokemonProps {
  pokemonId: string | number;
}

const LikePokemon = ({ pokemonId }: LikePokemonProps) => {
  const [isLiked, setIsLiked] = useState(false);
  const [animate, setAnimate] = useState(false);

  const { user } = useUserStore();

  const fetchLikeState = async () => {
    if (!user?.uid) return;

    const likesRef = doc(db, 'likes', user.uid);
    const docSanp = await getDoc(likesRef);

    if (docSanp.exists()) {
      const likes = docSanp.data().pokemons || [];
      setIsLiked(likes.includes(pokemonId));
    }
  };

  const onToggleLike = async () => {
    if (!user?.uid) return;

    setAnimate(true);

    const likesRef = doc(db, 'likes', user.uid);
    const docSnap = await getDoc(likesRef);
    let likes = [];

    setTimeout(() => setAnimate(false), 1000);

    if (docSnap.exists()) {
      likes = docSnap.data().pokemons || [];
      if (likes.includes(pokemonId)) {
        likes = likes.filter((id: string) => id !== pokemonId);
      } else {
        likes.push(pokemonId);
      }
    } else {
      likes = [pokemonId];
    }

    await setDoc(likesRef, { uid: user.uid, pokemons: likes });
    setIsLiked((prev) => !prev);
  };

  useEffect(() => {
    fetchLikeState();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pokemonId, user?.uid]);

  return (
    <div className={styles.stats__like__box}>
      <button className={styles.stats__like} onClick={onToggleLike}>
        {isLiked ? (
          <FaHeart
            size={18}
            color="#FF5050"
            className={`${styles.stats__like__animate} ${
              animate ? styles.animateHeart : ''
            }`}
          />
        ) : (
          <FaRegHeart size={18} color="#FF5050" />
        )}
        <span>찜하기</span>
      </button>
    </div>
  );
};

export default LikePokemon;