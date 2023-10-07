import type { NextPage } from "next";
import { MdDelete } from "@react-icons/all-files/md/MdDelete";

import { firestore } from "../firebase/clientApp";
import {
  collection,
  deleteDoc,
  doc,
  DocumentData,
  getDocs,
  limit,
  query,
  QueryDocumentSnapshot,
  updateDoc,
  where,
} from "@firebase/firestore";
import styles from "../styles/Home.module.css";
import { useEffect, useState } from "react";
import Link from "next/link";

const Home: NextPage = () => {
  const [todos, setTodos] = useState<QueryDocumentSnapshot<DocumentData>[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [check, setCheck] = useState<boolean>(true);

  const todosCollection = collection(firestore, "todos");

  const getTodos = async () => {
    const todosQuery = query(todosCollection, limit(10));
    const querySnapshot = await getDocs(todosQuery);
    const result: QueryDocumentSnapshot<DocumentData>[] = [];
    querySnapshot.forEach((snapshot) => {
      result.push(snapshot);
    });
    setTodos(result);
  };

  const updateTodo1 = async (documentId: string) => {
    // create a pointer to the document id
    const _todo = doc(firestore, `todos/${documentId}`);

    // update the doc by setting done to true
    await updateDoc(_todo, {
      done: true,
    });

    // retrieve todos
    getTodos();
  };

  const updateTodo2 = async (documentId: string) => {
    // create a pointer to the document id
    const _todo = doc(firestore, `todos/${documentId}`);

    // update the doc by setting done to true
    await updateDoc(_todo, {
      done: false,
    });

    // retrieve todos
    getTodos();
  };

  const deleteTodo = async (documentId: string) => {
    // create a pointer to the document id
    const _todo = doc(firestore, `todos/${documentId}`);

    // delete the doc
    await deleteDoc(_todo);

    // retrieve todos
    getTodos();
  };

  useEffect(() => {
    getTodos();
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  });

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>Todo App</h1>

        <div className={styles.grid}>
          {loading ? (
            <div className={styles.card}>
              <h2>Loading...</h2>
            </div>
          ) : todos.length === 0 ? (
            <div className={styles.card}>
              <h2>No todos</h2>
            </div>
          ) : (
            <div className={styles.card}>
              {todos.map((todo) => {
                return (
                  <div className={styles.cardContainer} key={todo.id}>
                    {todo.data().done == false ? (
                      <input
                        type="radio"
                        onClick={() => updateTodo1(todo.id)}
                      />
                    ) : (
                      <input
                        type="radio"
                        checked
                        onClick={() => updateTodo2(todo.id)}
                      />
                    )}
                    <div
                      className={
                        todo.data().done == true
                          ? styles.strickHeading
                          : styles.cardHeading
                      }
                    >
                      <h2>{todo.data().title}: </h2>
                      <p>{todo.data().description}</p>
                    </div>
                    <MdDelete
                      className={styles.cardIcon}
                      onClick={() => deleteTodo(todo.id)}
                    />
                  </div>

                  /* <div className={styles.cardActions}>
                        <button type="button" onClick={() => updateTodo(todo.id)}>
                          Mark as done
                        </button>
    
                        <button type="button" onClick={() => deleteTodo(todo.id)}>
                          Delete
                        </button>
                      </div> */
                );
              })}
            </div>
          )}
        </div>
        <Link href="/add-todo" className={styles.taskBtn}>
          + New task
        </Link>
      </main>
    </div>
  );
};

export default Home;
