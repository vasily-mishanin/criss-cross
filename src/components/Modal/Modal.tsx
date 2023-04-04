import { ReactNode } from 'react';
import ReactDOM from 'react-dom';

type ModalProps = {
  children: ReactNode;
};

export function Modal({ children }: ModalProps) {
  const modalContainer = document.getElementById(
    'modal-container'
  ) as HTMLDivElement;
  return ReactDOM.createPortal(children, modalContainer);
}
