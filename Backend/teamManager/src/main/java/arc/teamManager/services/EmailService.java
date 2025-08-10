package arc.teamManager.services;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendTaskAssignedEmail(String toEmail, String assignedBy, String taskTitle, String taskDescription) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("New Task Assigned: " + taskTitle);
        message.setText(
                "Hello,\n\n" +
                "A new task has been assigned to you.\n\n" +
                "Assigned By: " + assignedBy + "\n" +
                "Task Title: " + taskTitle + "\n" +
                "Description: " + taskDescription + "\n" +
                "Please check the application for more details.\n\n" +
                "Regards,\nTreeIt Team"
        );
        mailSender.send(message);
    }
}
