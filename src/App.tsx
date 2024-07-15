import React, { useEffect, useState } from 'react';
import './App.css';
const APIENDPOINT = 'https://hacker-news.firebaseio.com/v0'
const itemsPerPage = 6
interface JobPostingProps {
  time:number,
  title:string,
  by:string,
  url:string
}
// {
//   "by": "jamilbk",
//   "id": 35908337,
//   "score": 1,
//   "time": 1683838872,
//   "title": "Firezone (YC W22) is hiring Elixir and Rust engineers",
//   "type": "job",
//   "url": "https://www.ycombinator.com/companies/firezone/jobs"
// }
type Post = {
  by: string,
  id: number,
  score:number,
  time:number,
  title:string,
  type: string,
  url: string
}

const JobPosting:React.FC<JobPostingProps> = ({time,by,title,url}) =>{
  return(
    <div className='single__post'>
      <h3>{title}</h3>
      <p>
        <span>{by}</span>
        &nbsp;&nbsp;
        <span>{time}</span>
      </p>
    </div>
  )
}

function App() {
  const [itemIds,setItemIds] = useState<number[]>([])
  const [currentPage,setCurrentPage] = useState(0)
  const [fetchingData,setFetchingData] = useState(false)
  const [items,setItems] = useState<Post[]>([])

  useEffect(()=>{
    fetchItems(currentPage)
  },[currentPage])
const fetchItems = async(currPage: number):Promise<void> =>{
  let listItems:number[] = itemIds ? itemIds : []
  console.log(itemIds)
  if(!itemIds.length){
    setFetchingData(true)
    let items = await fetch(`${APIENDPOINT}/jobstories.json`)
    listItems = await items.json()
    setFetchingData(false)
    setItemIds(listItems)
  }
  const itemIdsForPage:number[] = listItems.slice(
    currPage*itemsPerPage,
    currPage*itemsPerPage + itemsPerPage
  )
  console.log(itemIdsForPage)
  const itemsForPage:Post[] = await Promise.all(
    itemIdsForPage.map((itemId)=> fetch(`${APIENDPOINT}/item/${itemId}.json`).then((res)=> res.json()))
  )
  setItems([...items,...itemsForPage])
}

  return (
    <div className="App">
      <h1>Hacker News Job Board</h1>
      {(items.length > 0)||!fetchingData ? (<div className='container'>
        {items.map((item)=>(
          <div key={item.id} className='job__list'>
            <JobPosting time={item.time} title ={item.title} url={item.url} by={item.by}/>
          </div>
        ))}
      </div>):'...loading'}
      <button onClick={()=>{
        setCurrentPage((curr)=>{
          return curr+1
        })
      }}>Load more</button>
    </div>
  );
}

export default App;
