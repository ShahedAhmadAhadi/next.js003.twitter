import { ChartBarIcon, ChatIcon, DotsHorizontalIcon, HeartIcon, ShareIcon, SwitchHorizontalIcon, TrashIcon } from "@heroicons/react/outline";
import { HeartIcon as HeartIconFilled, ChatIcon as ChatIconFilled} from "@heroicons/react/solid";
import { useSession } from "next-auth/react";
import Moment from 'moment'
import { useState, useEffect } from "react";
import { useRecoilState } from "recoil";
import { modalState } from "../atoms/modalAtom";
import { useRouter } from "next/dist/client/router";
import { collection, deleteDoc, doc, onSnapshot, setDoc } from "@firebase/firestore";
import { db } from "../firebase";

function Post({ id, post, postPage }) {

    const router = useRouter()

    const [comments, setComments] = useState([])
    const [isOpen, setIsOpen] = useState(modalState)
    const { data: session } = useSession()
    const [liked, setLiked] = useState(false)
    const [likes, setLikes] = useState([])
    // const [postId, setPostId] = useState(postIdState)

    useEffect(() => {
        onSnapshot(collection(db, "posts", id, "likes"), (snapshot) => {
            setLikes(snapshot.docs)
        })
    }, [id, db])

    useEffect(() => {
        setLiked(likes.findIndex(like => like.id === session?.user?.uid) !== -1)
    }, [likes])

    const likePost = async () => {
        if (liked) {
            await deleteDoc(doc(db, "posts", id, "likes", session.user.uid))
        } else {
            await setDoc(doc(db, "posts", id, "likes", session.user.uid), {
                username: session.user.name
            })
        }
    }

    return (
        <div className="p-3 flex cursor-pointer border-b border-gray-700" onClick={() => router.push(`/${id}`)}>
            {!postPage && (
                <img src={post?.userImg} alt="" className="rounded-full mr-4 h-11 w-11" />
            )}
            <div className={"flex flex-col space-y-2 w-full"}>
                <div className={`flex ${!postPage && "justify-between"}`}>
                    {postPage && (
                        <img src={post?.userImg} alt="Profile Pic" className="rounded-full mr-4 h-11 w-11" />
                    )}
                </div>
                <div className="text-[#6e767d]">
                    <div className={"inline-block group"}>
                        <h4 className={`font-bold text-[15px] sm:text-base text-[#d9d9d9] group-hover:underline ${!postPage && "inline-block"}`}>{post?.username}</h4>
                        <span className={`text-sm sm:text-[15px] ${!postPage && "ml-1.5"}`}>@{post?.tag}</span>
                    </div>{" "}
                    .{" "}
                    <span className="hover:underline text-sm sm:text-[15px]">
                        {/* <Moment fromNow>{post?.timestamp?.toDate()}</Moment> */}
                        <p>{post?.timestamp?.toString()}</p>
                    </span>
                    {!postPage && (
                        <p className={"text=[#d9d9d9] mt-0.5 text-[15px] sm:text-base"}>
                            {post?.text}
                        </p>
                    )}
                </div>
                <div className="icon group flex-shrink-0 ml-auto">
                    <DotsHorizontalIcon className="h-5 text-[#6e767d] group-hover:text-[#1d9bf0]" />
                </div>
                {postPage && (
                    <p className={"text=[#d9d9d9] mt-0.5 text-[15px] sm:text-base"}>
                        {post?.text}
                    </p>
                )}
                <img src={post?.image} alt="" className="rounded-2xl object-cover mr-2 max-h-[700px]" />
                <div className={`text-[#6e767d] flex justify-between w-10/12 ${postPage && "mx-auto"}`}>

                    <div
                        className="flex items-center space-x-1 group"
                        onClick={(e) => {
                            e.stopPropagation();
                            setPostId(id);
                            setIsOpen(true);
                        }}
                    >
                        <div className="icon group-hover:bg-[#1d9bf0] group-hover:bg-opacity-10">
                            <ChatIcon className="h-5 group-hover:text-[#1d9bf0]" />
                        </div>
                        {comments.length > 0 && (
                            <span className="group-hover:text-[#1d9bf0] text-sm">
                                {comments.length}
                            </span>
                        )}
                    </div>

                    {session.user.uid === post?.id ? (
                        <div
                            className="flex items-center space-x-1 group"
                            onClick={(e) => {
                                e.stopPropagation();
                                deleteDoc(doc(db, "posts", id));
                                router.push("/");
                            }}
                        >
                            <div className="icon group-hover:bg-red-600/10">
                                <TrashIcon className="h-5 group-hover:text-red-600" />
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center space-x-1 group">
                            <div className="icon group-hover:bg-green-500/10">
                                <SwitchHorizontalIcon className="h-5 group-hover:text-green-500" />
                            </div>
                        </div>
                    )}

                    <div
                        className="flex items-center space-x-1 group"
                        onClick={(e) => {
                            e.stopPropagation();
                            likePost();
                        }}
                    >
                        <div className="icon group-hover:bg-pink-600/10">
                            {liked ? (
                                <HeartIconFilled className="h-5 text-pink-600" />
                            ) : (
                                <HeartIcon className="h-5 group-hover:text-pink-600" />
                            )}
                        </div>
                        {likes.length > 0 && (
                            <span
                                className={`group-hover:text-pink-600 text-sm ${liked && "text-pink-600"
                                    }`}
                            >
                                {likes.length}
                            </span>
                        )}
                    </div>

                    <div className="icon group">
                        <ShareIcon className="h-5 group-hover:text-[#1d9bf0]" />
                    </div>
                    <div className="icon group">
                        <ChartBarIcon className="h-5 group-hover:text-[#1d9bf0]" />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Post
