"use client";

import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import axios from "axios";

interface Candidate {
  _id: string;
  name: string;
  votes: number;
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AF19FF", "#FF1919"];

const PieChartComponent: React.FC = () => {
  const [data, setData] = useState<{ name: string; votes: number }[]>([]);

  useEffect(() => {
    async function fetchCandidates() {
      try {
        const response = await axios.get("http://localhost:8080/candidates");
        const candidates = response.data.candidates;

        const formattedData = candidates.map((candidate: Candidate) => ({
          name: candidate.name,
          votes: candidate.votes,
        }));

        setData(formattedData);
      } catch (error) {
        console.error("Error fetching candidates:", error);
      }
    }

    fetchCandidates();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-gray-100">
      <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-lg">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-700">Voting </h2>

        <div className="flex justify-center">
          <ResponsiveContainer width="100%" height={350}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                outerRadius={120}
                fill="#8884d8"
                dataKey="votes"
              >
                {data.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default PieChartComponent;
