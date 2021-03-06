import React, { useEffect, useState }  from 'react'
import { DBConnection, DBQueryLog } from '../../data/models'
import { selectDBConnection } from '../../redux/dbConnectionSlice'
import { useAppSelector } from '../../redux/hooks'
import apiService from '../../network/apiService'
import toast from 'react-hot-toast'
import ProfileImage from '../user/profileimage'
import InfiniteScroll from 'react-infinite-scroll-component'


type DBHistoryPropType = { 
}

const DBHistoryFragment = ({}: DBHistoryPropType) => {

    const dbConnection: DBConnection | undefined = useAppSelector(selectDBConnection)

    const [dbQueryLogs, setDBQueryLogs] = useState<DBQueryLog[]>([])
    const [dbQueryLogsNext, setDBQueryLogsNext] = useState<number|undefined>(undefined)

    useEffect(()=>{
        if(dbConnection){
            fetchDBQueryLogs()
        }
    },[dbConnection])

    const fetchDBQueryLogs = async () => {
        let result = await apiService.getDBHistory(dbConnection!.id, dbQueryLogsNext)
        if (result.success) {
            setDBQueryLogs([...dbQueryLogs, ...result.data.list])
            setDBQueryLogsNext(result.data.next)
        } else {
            toast.error(result.error!)
        }
    }

    return (
        <React.Fragment>
            {dbConnection && 
                <React.Fragment>
                    <h1>Showing History in {dbConnection.name}</h1>
                    <br/>
                    <InfiniteScroll
                        dataLength={dbQueryLogs.length}
                        next={fetchDBQueryLogs}
                        hasMore={dbQueryLogsNext !== -1}
                        loader={
                            <p style={{ textAlign: 'center' }}>
                                Loading...
                            </p>
                        }
                        endMessage={
                            <p style={{ textAlign: 'center' }}>
                                <b>You have seen it all!</b>
                            </p>
                        }
                        scrollableTarget="mainContainer"
                        >
                        <table className={"table is-bordered is-striped is-narrow is-hoverable is-fullwidth"}>
                            <tbody> 
                                {dbQueryLogs.map((log)=>{
                                    return (
                                        <tr key={log.id}>
                                            <td>
                                                <ProfileImage imageUrl={log.user.profileImageUrl}/>
                                                &nbsp;&nbsp;{log.user.name ? log.user.name : log.user.email}
                                            </td>
                                            <td>
                                                {log.query}
                                            </td>
                                            <td>
                                                {log.createdAt}
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </InfiniteScroll>
                </React.Fragment>
            }
        </React.Fragment>
    )
}


export default DBHistoryFragment