"use client"

import { Navbar } from '@/components/Navbar';
import React from 'react';
import withAuth from '@/components/withAuth';

function CandidateDashboard() {
  return (
    <div>
      <Navbar />
      <h1>Welcome to the Candidate Dashboard</h1>
    </div>
  );
}

export default withAuth(CandidateDashboard, 'Candidate');