package cz.kudladev.backend;


import jakarta.persistence.*;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.sql.Date;

@Entity
@Getter
@Setter
@Table(name = "items")
public class Item {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotEmpty
    @Column(name = "text")
    private String text;

    @NotNull
    @Column(name = "pieces")
    private Integer pieces;

    @NotNull
    @Column(name = "checked")
    private Boolean checked;

    @NotNull
    @Column(name = "archived")
    private Boolean archived;

    @Column(name = "dateChecked")
    private Date dateChecked;
}
