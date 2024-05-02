/* eslint-disable @typescript-eslint/no-explicit-any */
import ReactQuill from 'react-quill';
import { Input, Select } from 'antd';
import useUserStore from '@/store/useUsersStore';
import { FormEvent, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './CommunityEditTextEditor.module.scss';
import { editCommunity } from '@/lib/firebaseQueryCommunity';

const CommunityEditTextEditor = () => {
  const location = useLocation();
  const { user } = useUserStore();
  const { data, id } = location.state || {};
  const [title, setTitle] = useState(data.title);
  const [editorRef, setEditorRef] = useState('');
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState(data.category);
  const navigate = useNavigate();

  useEffect(() => {
    if (data) {
      setTitle(data.title);
      setEditorRef(data.description);
    }
  }, [data]);

  const handleChange = (value: string) => {
    setCategory(value);
  };

  const handleChangeTitle = (e: any) => {
    setTitle(e.target.value);
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);

    if (!user?.uid) {
      alert('로그인이 필요합니다.');
      return;
    } else if (!editorRef) {
      alert('게시글을 저장하려면 내용을 채워주세요');
      return;
    } else if (!title) {
      alert('게시글을 저장하려면 제목을 채워주세요.');
      return;
    }

    try {
      let content = '';
      if (editorRef) {
        content = editorRef;
      }
      await editCommunity(`community/${id.id}`, {
        title: title,
        description: content,
        postImg: 'community_img.png',
        updateAt: new Date().toISOString(),
      });
      setTitle('');
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      navigate(`/community`);
    }
  };

  const handleChanges = (value: any) => {
    setEditorRef(value);
  };

  return (
    <div className={styles.container}>
      {loading ? <div>등록 중..</div> : ''}
      <form onSubmit={onSubmit}>
        <div className={styles.inputBox}>
          <div>
            <div className={styles.inputTitle}>카테고리</div>
            <Select
              className={styles.inputSelect}
              defaultValue={category}
              style={{ width: 130 }}
              onChange={handleChange}
              disabled
              options={[
                { value: '공지사항', label: '공지사항' },
                { value: '자유게시판', label: '자유게시판' },
                { value: '질문/답변', label: '질문/답변' },
                { value: '팁/정보', label: '팁/정보' },
                { value: '거래게시판', label: '거래게시판' },
                { value: '자랑하기', label: '자랑하기' },
              ]}
            />
          </div>
          <div className={styles.inputTitleContainer}>
            <div className={styles.inputTitle}>제목</div>
            <Input
              className={styles.inputTextBox}
              count={{ show: true, max: 50 }}
              defaultValue={title}
              onChange={handleChangeTitle}
            />
          </div>
        </div>
        <ReactQuill
          className={styles.reactQuill}
          style={{ height: '400px' }}
          value={editorRef}
          onChange={handleChanges}
        />
        <div className={styles.textEditerSubmitButton}>
          <button className={styles.ButtonLgStyle} type="submit">
            수정
          </button>
        </div>
      </form>
    </div>
  );
};

export default CommunityEditTextEditor;
