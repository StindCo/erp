import { createSlice, Reducer, Slice } from "@reduxjs/toolkit";
import { LocalforageStore } from "../models/localForage";
import { v4 as uuidv4 } from 'uuid';

const initialState = {
  tasks: [],
  current: 0,
};

export const TaskSlice: Slice = createSlice({
  name: "tasks",
  initialState: initialState,
  reducers: {
    setCurrentTask: (state, action) => {
      state.current = action.payload?.index;
    },
    loadTasks: (state, action) => {
      state.tasks = action.payload?.tasks;
    },
    createTask: (state, action) => {
      let tasks = state?.tasks != null ? [...state.tasks] : [];
      let newTask = { ...action.payload?.task, idTech: uuidv4() }
      tasks.push(newTask);
      LocalforageStore.setItem("tasks", tasks)
      state.tasks = tasks;
    },
    updateTask: (state, action) => {
      let tasks = [...state.tasks].map((value: any) => {
        if (value.idTech = action.payload?.task?.idTech) {
          value = action.payload?.Task;
        }
        return value;
      });

      LocalforageStore.setItem("tasks", tasks)
      state.tasks = tasks;
    },
    deleteTask: (state, action) => {
      let tasks = [...state.tasks].filter((value: any) => value?.idTech != action.payload?.task?.idTech);
      LocalforageStore.setItem("tasks", tasks)
      state.tasks = tasks;
    }
  },
});

// Action creators are generated for each case reducer function
export const { actions, reducer } = TaskSlice;

export const { setCurrentTask, loadTasks, createTask, updateTask, deleteTask } = actions;

export const getTasks = (state: any) => state.tasks?.tasks ?? [];

export const countTasks = (state: any) => state.tasks?.tasks.length;


export const getCurrentTask = (state: any) =>
  state.tasks.tasks[state.tasks?.current];

export const getCurrentTaskIndex = (state: any) =>
  state.tasks?.current;

export default reducer;
