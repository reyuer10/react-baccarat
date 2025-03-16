import React, { useEffect, useState } from 'react'
import BigRoad from './components/BigRoad'
import { fetchAddResults, fetchDeleteLatestGameResults, fetchGetResults, fetchResetGameResults } from './services/gameModifiedApi'
import { bigRoad, generateBigEyeBoyData, generateBigRoadData, generateCockroachPigData, generateMarkerRoadData, generateSmallRoadData, markerRoad } from './data/boardData'
import MarkerRoad from './components/MarkerRoad'
import Header from './components/Header'
import BigEyeBoy from './components/BigEyeBoy'
import SmallRoad from './components/SmallRoad'
import Footer from './components/Footer'
import CockroachPig from './components/CockroachPig'

function App() {
  let keySequence = ''


  const [boardData, setBoardData] = useState({
    bigRoad: generateBigRoadData(50),
    markerRoad: generateMarkerRoadData(50),
    bigEyeBoy: generateBigEyeBoyData(10),
    smallRoad: generateSmallRoadData(10),
    cockroachPig: generateCockroachPigData(10)
  })



  const [resultsBoardData, setResultsBoardData] = useState([])
  const [resultBoardMarkerData, setResultsBoardMarkerData] = useState([])
  const handleEnterKeyCode = async (e) => {
    let keyPress = e.key
    try {
      if (e.key === "Enter") {
        if (keySequence == 1) {
          const response = await fetchAddResults({
            result_name: "Player",
          })
          setResultsBoardData(response.bigRoadData);
          setResultsBoardMarkerData(response.markerRoadData);
        } else if (keySequence == 2) {
          const response = await fetchAddResults({
            result_name: "Banker",
          })
          setResultsBoardData(response.bigRoadData);
          setResultsBoardMarkerData(response.markerRoadData)
        } else if (keySequence == 3) {
          const response = await fetchAddResults({
            result_name: "Tie",
          })
          setResultsBoardData(response.bigRoadData);
          setResultsBoardMarkerData(response.markerRoadData)
        } else if (keySequence == 4) {
          const response = await fetchDeleteLatestGameResults();
          setResultsBoardData(response.bigRoadData);
          setResultsBoardMarkerData(response.markerRoadData)
        }
        keySequence = ''
      }

      if (e.key === "1" || e.key === "2" || e.key === "3" || e.key === "4") {
        keySequence += keyPress
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleFetchResetGameResults = async () => {
    try {
      const response = await fetchResetGameResults();
      if (response) {
        window.location.reload()
      }
    } catch (error) {
      console.log(error)
    }
  }


  useEffect(() => {

    document.body.addEventListener("keydown", handleEnterKeyCode)
    return () => {
      document.body.removeEventListener("keydown", handleEnterKeyCode)
    }
  }, [boardData])


  useEffect(() => {
    const handleFetchGameResults = async () => {
      try {
        const response = await fetchGetResults();
        // console.log(response)
        setResultsBoardData(response.bigRoadData);
        setResultsBoardMarkerData(response.markerRoadData)

      } catch (error) {
        console.log(error);
      }
    }
    handleFetchGameResults();

  }, [])




  return (
    <div className='grid grid-cols-24 h-screen p-4 gap-2'>
      <div className='border col-span-24 row-span-1'>
        <Header
          handleFetchResetGameResults={handleFetchResetGameResults}
        />
      </div>
      <div className=' border col-span-24 row-span-6 text-2xl font-bold flex roboto-mono-900 relative bg-gray-50'>
        <div className='absolute opacity-20 z-10 flex justify-center items-center h-full w-full'>
          <p className=' text-[108px] tracking-wider'>BIG ROAD</p>
        </div>
        <div className='flex z-20 border'>
          {boardData.bigRoad.map((b, index) => {
            return (
              <BigRoad
                key={index}
                b={b}
                resultsBoardData={resultsBoardData}
              />
            )
          })}
        </div>
      </div>
      <div className='border col-span-24 row-span-4 text-2xl font-bold flex  roboto-mono-900 relative bg-gray-50'>
        <div className='absolute opacity-20 z-10 flex justify-center items-center h-full w-full'>
          <p className=' text-[108px] tracking-wider'>BIG EYE BOY</p>
        </div>
        <div className='flex z-20 border-t-4 border-gray-300 w-full'>
          {boardData.bigEyeBoy.map((e, index) => {
            return (
              <BigEyeBoy e={e} key={index} />
            )
          })}
        </div>
      </div>
      <div className='border col-span-12 row-span-4 text-2xl font-bold flex  roboto-mono-900 relative bg-gray-50'>
        <div className='absolute opacity-20 z-10 flex justify-center items-center h-full w-full'>
          <p className=' text-[108px] tracking-wider'>SMALL ROAD</p>
        </div>
        <div className='flex z-20 border-t-4 border-gray-300 w-full'>
          {boardData.smallRoad.map((sr, index) => {
            return (
              <SmallRoad sr={sr} key={index} />
            )
          })}
        </div>
      </div>
      <div className='border col-span-12 row-span-4'>
        <CockroachPig />
      </div>
      <div className='border col-span-24 row-span-6 text-2xl font-bold flex  roboto-mono-900 relative bg-gray-50'>
        <div className='absolute opacity-20 z-10 flex justify-center items-center h-full w-full'>
          <p className=' text-[108px] tracking-wider '>MARKER ROAD</p>
        </div>
        <div className='flex z-20 border'>
          {boardData.markerRoad.map((m, index) => {
            return (
              <MarkerRoad m={m} key={index} resultBoardMarkerData={resultBoardMarkerData} />
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default App
// h-screen flex flex-col space-y-4 p-4 bg-lime-50
// <div className=''>
// <div className='space-x-2'>
//   <Header />
// </div>
// <div className='text-2xl font-bold flex roboto-mono-900 relative bg-gray-50'>
//   <div className='absolute opacity-20 z-10 flex justify-center items-center h-full w-full'>
//     <p className=' text-[108px] tracking-wider'>BIG ROAD</p>
//   </div>
//   <div className='flex z-20 border'>
//     {/* {boardData.bigRoad.map((b, index) => {
//       return (
//         <BigRoad
//           key={index}
//           b={b}
//           resultsBoardData={resultsBoardData}
//         />
//       )
//     })} */}
//   </div>
// </div>
// <div className='text-2xl font-bold flex  roboto-mono-900 relative bg-gray-50'>
//   <div className='absolute opacity-20 z-10 flex justify-center items-center h-full w-full'>
//     <p className=' text-[108px] tracking-wider '>MARKER ROAD</p>
//   </div>
//   <div className='flex z-20 border'>
//     {/* {boardData.markerRoad.map((m, index) => {
//       return (
//         <MarkerRoad m={m} key={index} resultBoardMarkerData={resultBoardMarkerData} />
//       )
//     })} */}
//   </div>
// </div>
// </div>
