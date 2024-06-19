"use client";

import { useState, useEffect } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import "./../app/app.css";


export default function App() {
  const name = useEffect(() => {
    // listTodos();
  }, []);


  return <div>Welcome</div>;
}
