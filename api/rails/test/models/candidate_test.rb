require "test_helper"

class CandidateTest < ActiveSupport::TestCase
  test "accepts valid status values" do
    candidate = Candidate.new(
      name: "Test",
      years_exp: 1,
      status: "pending",
      date_applied: Time.current,
      reviewed: false,
      description: "desc"
    )
    assert candidate.valid?
  end

  test "rejects invalid status" do
    candidate = Candidate.new(status: "unknown")
    assert_not candidate.valid?
    assert_includes candidate.errors[:status], "is not included in the list"
  end
end
