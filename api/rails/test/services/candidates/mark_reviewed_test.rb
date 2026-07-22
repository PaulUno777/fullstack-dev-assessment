# frozen_string_literal: true

require "test_helper"

class CandidatesMarkReviewedTest < ActiveSupport::TestCase
  setup do
    @candidate = Candidate.create!(
      name: "Review Me",
      years_exp: 3,
      status: "pending",
      date_applied: Time.zone.parse("2018-06-01 10:00:00"),
      reviewed: false,
      description: "associate"
    )
  end

  test "marks pending candidate as reviewed" do
    result = Candidates::MarkReviewed.call(candidate: @candidate, reviewed: true)

    assert result.ok?
    assert_equal true, result.candidate.reviewed
    assert_equal "pending", result.candidate.status
  end

  test "is idempotent when already reviewed" do
    @candidate.update!(reviewed: true)
    result = Candidates::MarkReviewed.call(candidate: @candidate, reviewed: true)

    assert result.ok?
    assert_equal true, result.candidate.reviewed
  end
end
