package com.guesmish.book_network.feedBack;

import com.guesmish.book_network.common.PageResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("feedbacks")
@RequiredArgsConstructor
@Tag(name="FeedBack")
public class FeedBackController {

    private final FeedBackService feedBackService;


    @PostMapping
    public ResponseEntity<Integer> saveFeedback(
           @Valid @RequestBody FeedBackRequest feedBackRequest,
           Authentication connectedUser
           ) {
        return ResponseEntity.ok(feedBackService.save(feedBackRequest,connectedUser));
    }


    @GetMapping("/book/{book-id}")
    public ResponseEntity<PageResponse<FeedBackResponse>> findAllFeedbackByBook(
           @PathVariable("book-id") Integer bookId,
           @RequestParam(name = "page", defaultValue = "0", required = false) int page,
           @RequestParam(name = "size", defaultValue = "10", required = false) int size,
           Authentication connectedUser
    ) {
        return ResponseEntity.ok(feedBackService.findAllFeedBacksByBook(bookId,page, size, connectedUser));
    }




}
