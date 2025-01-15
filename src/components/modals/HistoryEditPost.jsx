import React from 'react'
import { Modal, Button } from 'antd'
const HistoryEditPost = ({ open, onClose, post }) => {


    const handleClose = () => {

        onClose()
    }
    return (
        <>
            <Modal
                title={
                    <div className="flex items-center gap-2 pb-2 border-b">
                        <span className="text-lg font-semibold">Lịch sử chỉnh sửa bài viết</span>
                    </div>
                }

                open={open}
                onCancel={() => onClose()}
                getContainer={() => document.body}
                maskClosable={false}
                closeIcon={null}
                width={600}
                className="profile-modal"
                footer={[
                    <Button
                        key="cancel"
                        onClick={handleClose}
                        className="hover:bg-gray-100"
                    >
                        Đóng
                    </Button>,

                ]}
            >

            </Modal>



        </>
    )
}

export default HistoryEditPost