"use client";
/* eslint-disable @next/next/no-img-element */
import { GradientText } from "@/app/components/GradientText/GradientText";
import { HoverEffect } from "@/app/components/ui/card-hover-effect";
import { motion } from "framer-motion";

export const projects = [
  {
    title: "I love learning 📚",
    description:
      "Learning is more than just books to me. I'm talking wood working, cooking, camping, snowboarding. You name it i'll enjoy learning it!",
  },
  {
    title: "I'm a passionate educator 👨‍🏫",
    description:
      "I've been teaching and mentoring for about 10 years now. Spreading my knowledge to others is one of my favorite things to do.",
  },
  {
    title: "Fitness keeps me smiley 🏀",
    description:
      "You'll mostly catch me doing random calisthenics like handstands & pullups. But I also love my basketball, climbing, hiking ect!",
  },
];

export default function Homepage() {
  return (
    <main className="flex w-full flex-col gap-12">
      {/* Heading and face */}
      <div className="pointer-events-none relative z-30 flex w-full flex-row flex-wrap items-center justify-between">
        <div className="mx-auto  flex max-w-3xl flex-col ">
          <motion.h1
            className="mb-3 text-6xl font-extrabold leading-tight tracking-tighter"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <GradientText>{"Heyo! I'm Julian"}</GradientText> 👋
            <br />
            <motion.span> good to have you here.</motion.span>
          </motion.h1>

          <motion.span
            className="text-3xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.7 }}
          >
            Take a peek around and learn about me 👀
          </motion.span>
        </div>

        <motion.div className="mx-auto flex h-80 w-80 items-center justify-center overflow-hidden rounded-full">
          <img
            src={
              "https://prod-treena-exam-exambucketbucketf69493db-trsemuqwufkf.s3.ap-southeast-2.amazonaws.com/jhamama-me.png"
            }
            alt="me"
            className="w-full"
          />
        </motion.div>
      </div>

      <div className="z-30">
        <h2 className="mb-1 ml-2 text-3xl font-extrabold">
          Some quick things about me
        </h2>
        <HoverEffect items={projects} className="pointer-events-auto" />
      </div>
    </main>
  );
}
