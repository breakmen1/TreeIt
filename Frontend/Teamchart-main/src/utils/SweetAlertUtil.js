import Swal from 'sweetalert2';

// Success Alert
export const showSuccessAlert = (message) => {
  Swal.fire({
    icon: 'success',
    title: 'Success!',
    text: message,
    confirmButtonColor: '#3085d6',
    background: '#f0fff4',
  });
};

// Error Alert
export const showErrorAlert = (message) => {
  Swal.fire({
    icon: 'error',
    title: 'Oops...',
    text: message,
    confirmButtonColor: '#d33',
    background: '#fff0f0',
  });
};

// Confirmation Dialog
export const showConfirmAlert = async ({ title, text }) => {
  const result = await Swal.fire({
    title,
    text,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#aaa',
    confirmButtonText: 'Yes',
    cancelButtonText: 'Cancel',
  });
  return result.isConfirmed;
};
