import { doc } from "@firebase/firestore";
import { setDoc } from "firebase/firestore";
import type { NextPage } from "next";
import { useState } from "react";
import { firestore } from "../firebase/clientApp";
import styles from "../styles/Home.module.css";
import Link from "next/link";

const AddTodo: NextPage = () => {
  const [title, setTitle] = useState<string>(""); // title
  const [description, setDescription] = useState<string>(""); // description
  const [error, setError] = useState<string>(""); // error
  const [message, setMessage] = useState<string>(""); // message

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault(); // avoid default behaviour

    if (!title || !description) {
      // check for any null value
      return setError("All fields are required");
    } else {
      setError("a");
    }
    addTodo();
  };

  const addTodo = async () => {
    // get the current timestamp
    const timestamp: string = Date.now().toString();
    // create a pointer to our document
    const _todo = doc(firestore, `todos/${timestamp}`);
    // structure the todo data
    const todoData = {
      id: Date.now(),
      title,
      description,
      done: false,
    };

    try {
      //add the document
      await setDoc(_todo, todoData);
      //show a success message
      setMessage("Todo added successfully");
      setError("");
      //reset fields
      setTitle("");
      setDescription("");
    } catch (error) {
      //show an error message
      setError("An error occurred while adding todo");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.main}>
        <h1 className={styles.title}>Add Todo</h1>

        <form onSubmit={handleSubmit} className={styles.form}>
          {error ? (
            <div className={styles.formGroup}>
              <p className={styles.error}>{error}</p>
            </div>
          ) : null}

          {message ? (
            <div className={styles.formGroup}>
              <p className={styles.success}>
                {message}. Proceed to <Link href="/">Home</Link>
              </p>
            </div>
          ) : null}

          <div className={styles.formGroup}>
            <label>Title</label>
            <input
              type="text"
              placeholder="Todo title"
              onChange={(e) => setTitle(e.target.value)}
              value={title}
            />
          </div>

          <div className={styles.formGroup}>
            <label>Description</label>
            <textarea
              placeholder="Todo description"
              onChange={(e) => setDescription(e.target.value)}
              value={description}
            />
          </div>

          <div className={styles.formGroup}>
            <button type="submit">Submit</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTodo;
