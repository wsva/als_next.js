import { Card, CardBody, CardHeader, Divider } from "@heroui/react";
import Link from "next/link";

type Props = {
  href: string;
  label: string;
  description: string;
}

const Item = async ({ href, label, description }: Props) => {
  return (
    <Card className="flex max-w-[400px] m-2">
      <CardHeader>
        <Link href={href} className="text-blue-600 hover:underline" >
          {label}
        </Link>
      </CardHeader>
      <Divider />
      <CardBody>
        <p>{description}</p>
      </CardBody>
    </Card>
  )
}

export default async function Home() {
  return (
    <div className="container grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4">
      <Item href='/listening/dictation' label='Dictation'
        description='Upload audio and subtitle, and then do dictation.'
      />
      <Item href='http://yanansworkshop.site:1235/' label='Dictation(old)'
        description='dictation in textbook'
      />
      <Card className="m-4 col-span-full"></Card>

      <Item href='/word/store' label='Word Store'
        description='Words from public subtitles, ordered by frequency.'
      />
      <Item href='/card/add?edit=y' label='New Card'
        description='Card is for words, sentences or others.'
      />
      <Item href='/card/my' label='My Cards'
        description='View my cards.'
      />
      <Item href='/card/test' label='Card Test'
        description='Learn cards through tests and set familiarity.'
      />
      <Card className="m-4 col-span-full"></Card>
      
      <Item href='/blog/add' label='New Blog'
        description='Blog is for writings.'
      />
      <Item href='/blog' label='Blog List'
        description='View all blogs.'
      />
      </div>
  );
}
