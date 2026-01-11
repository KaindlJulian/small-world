import { useState } from 'react';
import { Button, Modal } from '../components';

export function BridgeExplore() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div class='align-items flex w-full justify-center'>
            <Button onClick={() => setIsModalOpen(true)}>Open Modal</Button>
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title='Bridge Explore'
            >
                Bridge explore page
                <Button onClick={() => setIsModalOpen(false)}>
                    Close Modal
                </Button>
            </Modal>
        </div>
    );
}
