const Loading = () => {
    return (
        <div className="flex min-h-screen w-full items-center justify-center bg-gray-100">
            <div className="flex flex-col items-center gap-3 rounded-lg border border-gray-200 bg-white px-6 py-4 shadow-sm">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-indigo-600" />
                <p className="text-sm font-medium text-gray-700">Loading...</p>
            </div>
        </div>
    )
}

export default Loading
