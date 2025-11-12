package models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.Objects;

@Entity
@Table(name = "issue_tags", schema = "issues-service-schema")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class IssueTag {

    @Id
    @Column(name = "issue_id", nullable = false)
    private Long issueId;

    @Id
    @Column(name = "tag_id", nullable = false)
    private Long tagId;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        IssueTag issueTag = (IssueTag) o;
        return Objects.equals(issueId, issueTag.issueId) && Objects.equals(tagId, issueTag.tagId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(issueId, tagId);
    }
}
