"use client"

import { SetStateAction, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import LoginForm from '@/components/LoginForm';

export default function Login() {
  return (
    <main>
      <LoginForm></LoginForm>
    </main>
  )
}