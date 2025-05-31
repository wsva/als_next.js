'use client'

import React from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, Button, useDisclosure } from "@heroui/react";
import LoginForm from './LoginForm';

export default function AddModal() {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    return (
        <>
            <Button onPress={onOpen} variant='bordered' className='text-gray-500'>
                Login
            </Button>

            <Modal
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                placement='top-center'
            >
                <ModalContent>
                    <ModalHeader className='flex flex-col gap-1'>Edit Word</ModalHeader>
                    <ModalBody>
                        <LoginForm />
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    );
}
