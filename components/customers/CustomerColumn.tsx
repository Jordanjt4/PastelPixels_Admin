"use client"

import React from 'react'
import { ColumnDef } from "@tanstack/react-table";
import Link from 'next/link';

export const columns: ColumnDef<CustomerType>[] = [
  {
    accessorKey: "clerkId",
    header: "Clerk ID",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
]