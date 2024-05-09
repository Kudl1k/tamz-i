package cz.kudladev.backend;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class ItemController {

    @Autowired
    private ItemService itemService;

    @GetMapping("/items")
    public List<Item> getAllItems() {
        return itemService.getAllItems();
    }

    @GetMapping("/items/{id}")
    public Item getItemById(@PathVariable Long id) {
        return itemService.getItemById(id);
    }

    @PostMapping("/items")
    public Item saveItem(@RequestBody Item item) {
        return itemService.createItem(item);
    }

    @DeleteMapping("/items/{id}")
    public void deleteItem(@PathVariable Long id) {
        itemService.deleteItem(id);
    }

}
