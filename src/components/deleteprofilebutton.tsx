import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Trash2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

const DeleteProfileButton = () => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteProfile = async () => {
    setIsDeleting(true);
    
    try {
      // Simulate API call to delete profile
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success("Your profile has been permanently deleted.");
      
      // In a real app, you would redirect to a different page or logout
      console.log('Profile deleted successfully');
    } catch (error) {
      toast.error("Failed to delete profile. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" className="gap-2">
          <Trash2 className="w-4 h-4" />
          Delete Profile
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Your Profile</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete your profile? This action cannot be undone. 
            All your data, including saved institutes, reviews, and personal information will be permanently removed.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDeleteProfile}
            disabled={isDeleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isDeleting ? 'Deleting...' : 'Delete Profile'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteProfileButton;