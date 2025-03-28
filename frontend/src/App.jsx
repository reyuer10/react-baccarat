import React, { useEffect, useState } from 'react'
import BigRoad from './components/BigRoad'
import {
  fetchAddDetailGameResults,
  fetchAddResults,
  fetchDeleteLatestGameResults,
  fetchGetResults,
  fetchResetGameResults
} from './services/gameModifiedApi'

import {
  generateBigEyeBoyData,
  generateBigRoadData,
  generateCockroachPigData,
  generateMarkerRoadData,
  generateSmallRoadData,
} from './data/boardData'

import MarkerRoad from './components/MarkerRoad'
import Header from './components/Header'
import BigEyeBoy from './components/BigEyeBoy'
import SmallRoad from './components/SmallRoad'
import CockroachPig from './components/CockroachPig'
import Predictions from './components/Predictions'

function App() {
  let keySequence = ''


  const [boardData, setBoardData] = useState({
    bigRoad: generateBigRoadData(40),
    markerRoad: generateMarkerRoadData(40),
    bigEyeBoy: generateBigEyeBoyData(60),
    smallRoad: generateSmallRoadData(30),
    cockroachPig: generateCockroachPigData(30)
  })

  const [count, setCount] = useState(0);


  const [resultsBoardData, setResultsBoardData] = useState([])
  const [resultBoardMarkerData, setResultsBoardMarkerData] = useState([])
  const [resultBigEyeBoyData, setResultBigEyeBoyData] = useState([])
  const [resultSmallRoadData, setResultSmallRoadData] = useState([])
  const [predictionsData, setPredictionsData] = useState([])

  const [round, setRound] = useState(0)
  const handleEnterKeyCode = async (e) => {
    let keyPress = e.key
    try {
      if (e.key === "Enter") {
        if (keySequence == 1) {
          const response = await fetchAddResults({
            result_name: "Player",
          })

          const responseFromBigEyeBoyData = await fetchAddDetailGameResults();
          setPredictionsData(responseFromBigEyeBoyData?.predictionsData)
          setResultBigEyeBoyData(responseFromBigEyeBoyData.bigEyeBoyData)
          setResultSmallRoadData(responseFromBigEyeBoyData.smallRoadData)
          setResultsBoardData(response.bigRoadData);
          setResultsBoardMarkerData(response.markerRoadData);

        } else if (keySequence == 2) {
          const response = await fetchAddResults({
            result_name: "Banker",
          })
          const responseFromBigEyeBoyData = await fetchAddDetailGameResults();
          setPredictionsData(responseFromBigEyeBoyData?.predictionsData)
          setResultBigEyeBoyData(responseFromBigEyeBoyData.bigEyeBoyData)
          setResultSmallRoadData(responseFromBigEyeBoyData.smallRoadData)
          setResultsBoardData(response.bigRoadData);
          setResultsBoardMarkerData(response.markerRoadData)

        } else if (keySequence == 3) {
          const response = await fetchAddResults({
            result_name: "Tie",
          })
          const responseFromBigEyeBoyData = await fetchAddDetailGameResults();
          setPredictionsData(responseFromBigEyeBoyData?.predictionsData)
          setResultBigEyeBoyData(responseFromBigEyeBoyData.bigEyeBoyData)
          setResultSmallRoadData(responseFromBigEyeBoyData.smallRoadData)
          setResultsBoardData(response.bigRoadData);
          setResultsBoardMarkerData(response.markerRoadData)

        } else if (keySequence == 4) {
          const response = await fetchDeleteLatestGameResults();
          // const responseFromBigEyeBoyData = await fetchAddDetailGameResults();
          setPredictionsData(response?.predictionsData);
          setResultBigEyeBoyData(response.bigEyeBoyData)
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
  }, [boardData]);




  // useEffect(() => {
  //   const createInterval = setInterval(async () => {
  //     setCount(Number(Math.random() * 6).toFixed(0))
  //   }, 500);

  //   return () => {
  //     clearInterval(createInterval)
  //   }
  // }, []);

  // console.log(count)



  // const randomAddResults = async () => {
  //   try {
  //     if (count >= 0 && count <= 1) {
  //       const response = await fetchAddResults({
  //         result_name: "Banker",
  //       })

  //       const isCol40Found = response?.bigRoadData.find(r => r.num_posCol == 40) ? true : false
  //       if (isCol40Found) {
  //         const response = await fetchResetGameResults();
  //         if (response) {
  //           window.location.reload()
  //           return
  //         }
  //       }

  //       const responseFromBigEyeBoyData = await fetchAddDetailGameResults();

  //       setPredictionsData(responseFromBigEyeBoyData?.predictionsData)
  //       setResultBigEyeBoyData(responseFromBigEyeBoyData.bigEyeBoyData)
  //       setResultsBoardData(response.bigRoadData);
  //       setResultsBoardMarkerData(response.markerRoadData)

  //     } else if (count >= 2 && count <= 3) {
  //       const response = await fetchAddResults({
  //         result_name: "Tie",
  //       })

  //       const isCol40Found = response?.bigRoadData.find(r => r.num_posCol == 40) ? true : false
  //       if (isCol40Found) {
  //         const response = await fetchResetGameResults();
  //         if (response) {
  //           window.location.reload()
  //           return
  //         }
  //       }
  //       const responseFromBigEyeBoyData = await fetchAddDetailGameResults();
  //       setPredictionsData(responseFromBigEyeBoyData?.predictionsData)
  //       setResultBigEyeBoyData(responseFromBigEyeBoyData.bigEyeBoyData)
  //       setResultsBoardData(response.bigRoadData);
  //       setResultsBoardMarkerData(response.markerRoadData)
  //     } else if (count >= 4 && count <= 5) {
  //       const response = await fetchAddResults({
  //         result_name: "Player",
  //       })

  //       const isCol40Found = response?.bigRoadData.find(r => r.num_posCol == 40) ? true : false
  //       if (isCol40Found) {
  //         const response = await fetchResetGameResults();
  //         if (response) {
  //           window.location.reload()
  //           return
  //         }
  //       }
  //       const responseFromBigEyeBoyData = await fetchAddDetailGameResults();
  //       setPredictionsData(responseFromBigEyeBoyData?.predictionsData)
  //       setResultBigEyeBoyData(responseFromBigEyeBoyData.bigEyeBoyData)
  //       setResultsBoardData(response.bigRoadData);
  //       setResultsBoardMarkerData(response.markerRoadData)
  //     }

  //     // else if (count == 0) {
  //     //   const response = await fetchAddResults({
  //     //     result_name: "Tie",
  //     //   })
  //     //   const responseFromBigEyeBoyData = await fetchAddDetailGameResults();
  //     //   setPredictionsData(responseFromBigEyeBoyData?.predictionsData)
  //     //   setResultBigEyeBoyData(responseFromBigEyeBoyData.bigEyeBoyData)
  //     //   setResultsBoardData(response.bigRoadData);
  //     //   setResultsBoardMarkerData(response.markerRoadData)
  //     // }
  //   } catch (error) {
  //     console.log(error)
  //   }
  // }

  // useEffect(() => {
  //   randomAddResults()
  // }, [count])






  useEffect(() => {
    const handleFetchGameResults = async () => {
      try {
        const response = await fetchGetResults();
        setResultBigEyeBoyData(response.bigEyeBoyData)
        setResultsBoardData(response.bigRoadData);
        setResultsBoardMarkerData(response.markerRoadData);
        setPredictionsData(response.predictionsData)
        setResultSmallRoadData(response.smallRoadData)
      } catch (error) {
        console.log(error);
      }
    }
    handleFetchGameResults();

  }, [])




  return (
    <div className='h-screen bg-[#282828] grid grid-cols-24 p-4 gap-2 '>
      <div className=' col-span-24 row-span-1 mx-auto'>
        <Header
          handleFetchResetGameResults={handleFetchResetGameResults}
          round={round}
        />
      </div>
      <div className='max-[1600px]:hidden col-span-24 row-span-6 font-bold flex roboto-mono-900 relative bg-[#fff0cd] overflow-x-hidden'>
        <div className='absolute opacity-20 z-10 flex justify-center items-center h-full w-full '>
          <p className=' text-[100px] tracking-wider'>BIG ROAD</p>
        </div>
        <div className='flex z-20 w-full'>
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
      <div className='max-[1600px]:hidden col-span-24 row-span-4 font-bold flex roboto-mono-900 relative bg-[#fff0cd] overflow-x-hidden'>
        <div className='absolute opacity-20 z-10 flex justify-center items-center h-full w-full'>
          <p className=' text-[80px] tracking-wider'>BIG EYE BOY</p>
        </div>
        <div className='flex z-20 w-full'>
          {boardData.bigEyeBoy.map((e, index) => {
            return (
              <BigEyeBoy e={e} key={index} bigEyeBoyData={resultBigEyeBoyData} />
            )
          })}
        </div>
      </div>
      <div className='max-[1600px]:hidden col-span-12 row-span-4 font-bold flex roboto-mono-900 relative bg-[#fff0cd] overflow-x-hidden'>
        <div className='absolute opacity-20 z-10 flex justify-center items-center h-full w-full'>
          <p className=' text-[60px] tracking-wider'>SMALL ROAD</p>
        </div>
        <div className='flex z-20 w-full'>
          {boardData.smallRoad.map((sr, index) => {
            return (
              <SmallRoad sr={sr} key={index} smallRoadData={resultSmallRoadData} />
            )
          })}
        </div>
      </div>
      <div className='max-[1600px]:hidden col-span-12 row-span-4 font-bold flex roboto-mono-900 relative bg-[#fff0cd] overflow-x-hidden'>
        <div className='absolute opacity-20 z-10 flex justify-center items-center h-full w-full'>
          <p className='text-[60px] tracking-wider'>COCKROACH PIG</p>
        </div>
        <div className='flex z-20 w-full'>
          {boardData.cockroachPig.map((cp, index) => {
            return (
              <CockroachPig cp={cp} key={index} />
            )
          })}
        </div>
      </div>
      <div className='max-[1600px]:hidden col-span-22 row-span-6 font-bold flex roboto-mono-900 relative bg-[#fff0cd] overflow-x-hidden'>
        <div className='absolute opacity-20 z-10 flex justify-center items-center h-full w-full'>
          <p className=' text-[100px] tracking-wider'>MARKER ROAD</p>
        </div>
        <div className='flex z-20 w-full'>
          {boardData.markerRoad.map((m, index) => {
            return (
              <MarkerRoad
                m={m}
                key={index}
                resultBoardMarkerData={resultBoardMarkerData}
              />
            )
          })}
        </div>
      </div>
      <div className='col-span-2 row-span-6 bg-[#fff0cd] shadow-inner shadow-gray-500 flex justify-center flex-col items-center'>
        <Predictions
          predictionsData={predictionsData}
        />
      </div>
    </div>
  )
}

export default App